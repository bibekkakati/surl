const { insertUrl } = require("../db/query");
const getUniqueKey = require("../helpers/getUniqueKey");
const isValidURL = require("../helpers/isValidURL");
const urlStore = require("../store/urlStore");

const getShortUrl = async (url) => {
	if (!url) {
		return [null, "URL is required"];
	}
	if (!isValidURL(url)) {
		return [null, "URL is not valid"];
	}
	// Remove trailing slash
	if (url[url.length - 1] === "/") {
		url = url.slice(0, url.length - 1);
	}
	// Key Gen Limit is 10
	const reGenLimit = 10;
	var surlId = null;

	for (let i = 0; i < reGenLimit; i++) {
		const key = getUniqueKey();
		// Check if generated key exists in cache
		if (urlStore.get(key)) {
			continue;
		}
		const [result, error] = await insertUrl(key, url);
		if (error !== null) {
			break;
		}
		if (result) {
			surlId = key;
			urlStore.set(key, {
				url: url,
				hits: 0,
			});
			break;
		}
	}
	if (surlId === null) return [null, "Something went wrong"];
	return [surlId, null];
};

module.exports = getShortUrl;
