const { insertUrl } = require("../db/query");
const getUniqueKey = require("../helpers/getUniqueKey");
const isValidURL = require("../helpers/isValidURL");
const urlStore = require("../store/urlStore");

const getShortUrl = (url) => {
	return new Promise(async (resolve, reject) => {
		// Check if URL is valid
		if (!url) {
			return reject("URL is required");
		}
		if (!isValidURL(url)) {
			return reject("URL is not valid");
		}

		// Remove trailing slash
		if (url[url.length - 1] === "/") {
			url = url.slice(0, url.length - 1);
		}

		// Key Gen Limit is 10
		const reGenLimit = 10;

		let surlId = null;
		for (let i = 0; i < reGenLimit; i++) {
			// Get a unique key
			surlId = getUniqueKey();

			// Check if generated key exists in cache
			if (urlStore.get(surlId)) {
				continue;
			}
			try {
				surlId = await insertUrl(surlId, url);

				// If surlId exists in DB it will return falsy value
				if (surlId) {
					resolve(surlId);
					urlStore.set(surlId, {
						url: url,
						hits: 0,
					});
					break;
				}
			} catch (error) {
				reject(error);
				break;
			}
		}
		if (!surlId) return reject("Something went wrong");
	});
};

module.exports = getShortUrl;
