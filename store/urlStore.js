const NodeCache = require("node-cache");
const URL_CACHE = new NodeCache();

const set = async (key, data) => {
	return URL_CACHE.set(key, data, 2 * 24 * 60 * 60);
};

const get = async (key) => {
	return URL_CACHE.get(key);
};

const del = async (key) => {
	return URL_CACHE.del(key);
};

module.exports = {
	set,
	get,
	del,
};
