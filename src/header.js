/*
Differentia.js
Object Algorithm & Graph Theory Library
https://github.com/Floofies/Differentia.js
*/
var differentia = (function () {
"use strict";
// Checks if certain RegExp props are supported.
var supportedRegExpProps = {
	sticky: "sticky" in RegExp.prototype,
	unicode: "unicode" in RegExp.prototype,
	flags: "flags" in RegExp.prototype
};
const structs = {};
const strategies = {};