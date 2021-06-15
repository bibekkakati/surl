const DB = require("../../db/query");
const isValidURL = require("../../helpers/isValidURL");
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

	// Set 2 years expiry in milliseconds
	const expiry = Date.now() + 31536000000;

	const key = await KEY_STORE.get();
	const [result, error] = await DB.insertUrl(key, url, expiry);
	if (error !== null) {
		return [null, "Something went wrong"];
	}
	return [key, null];
};

module.exports = getShortUrl;
