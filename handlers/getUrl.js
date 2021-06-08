const { getOriginalUrl, updateUrlHits } = require("../db/query");
const urlStore = require("../store/urlStore");

const getUrl = (surlId) => {
	return new Promise(async (resolve, reject) => {
		if (!surlId) {
			return reject(null);
		}
		let data = urlStore.get(surlId);

		// Cache hit
		if (data) {
			updateUrlHits(surlId, data.hits + 1);

			// Update the cache
			urlStore.set(surlId, {
				url: data.url,
				hits: data.hits + 1,
			});

			return resolve(data.url);
		}

		// Cache miss
		try {
			data = await getOriginalUrl(surlId);
			updateUrlHits(surlId, data.hits + 1);

			// Update the cache
			urlStore.set(surlId, {
				url: data.url,
				hits: data.hits + 1,
			});

			return resolve(data.url);
		} catch (error) {
			return reject(error);
		}
	});
};

module.exports = getUrl;
