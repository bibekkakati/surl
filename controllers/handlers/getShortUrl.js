const { insertUrl } = require("../../db/query");
const isValidURL = require("../../helpers/isValidURL");
const URL_STORE = require("../../store/urlStore");
const KEY_STORE = require("../../store/keyStore");

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
	// Key Gen Limit is 5
	const retryLimit = 5;
	var shortUrlId = null;

	for (let i = 0; i < retryLimit; i++) {
		const key = KEY_STORE.get();
		// Check if generated key exists in cache
		if (URL_STORE.get(key)) {
			continue;
		}
		const [result, error] = await insertUrl(key, url);
		if (error !== null) {
			break;
		}
		if (result !== null) {
			shortUrlId = key;
			URL_STORE.set(key, {
				url: url,
				hits: 0,
			});
			break;
		}
	}
	if (shortUrlId === null) return [null, "Something went wrong"];
	return [shortUrlId, null];
};

module.exports = getShortUrl;
