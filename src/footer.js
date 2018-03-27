// Modules to Reveal
var publicModules = {
	dfs: dfs,
	bfs: bfs,
	getContainerLength: getContainerLength,
	isContainer: isContainer,
};
// Automatically Reveal Strategy Interfaces
for (var name in strategies) {
	publicModules[name] = strategies[name].interface;
}
// Automatically Reveal Data Structures
for (var name in structs) {
	publicModules[name] = structs[name];
}
return publicModules;
})();
// NodeJS `require` compatibility
if (typeof module !== "undefined") {
	module.exports = differentia;
}