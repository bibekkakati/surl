const { getUrlHits } = require("../db/query");
const urlStore = require("../store/urlStore");

const getHits = (surlId) => {
	return new Promise(async (resolve, reject) => {
		if (!surlId) {
			return reject(null);
		}

		const data = urlStore.get(surlId);

		// Cache hit
		if (data) {
			return resolve(data.hits);
		}

		//Cache miss
		try {
			let hits = await getUrlHits(surlId);
			return resolve(hits);
		} catch (error) {
			return reject(error);
		}
	});
};

module.exports = getHits;
