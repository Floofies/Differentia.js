if ((typeof module) !== "undefined") {
	var global = jasmine.getGlobal();
	global.differentia = require('../src/index.js');
	global.d = global.differentia;
} else {
	var global = {};
	global.differentia = differentia;
	global.d = differentia;
}