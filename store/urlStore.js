const NodeCache = require("node-cache");
const URL_CACHE = new NodeCache();

const set = (key, data) => {
	return URL_CACHE.set(key, data, 2 * 24 * 60 * 60);
};

const get = (key) => {
	return URL_CACHE.get(key);
};

const del = (key) => {
	return URL_CACHE.del(key);
};

module.exports = {
	set,
	get,
	del,
};
