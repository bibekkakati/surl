const { getOriginalUrl, updateUrlHits } = require("../db/query");

const getUrl = (surlId) => {
	return new Promise(async (resolve, reject) => {
		if (!surlId) {
			return reject(null);
		}
		try {
			let data = await getOriginalUrl(surlId);
			updateUrlHits(surlId, data.hits + 1);
			return resolve(data.url);
		} catch (error) {
			return reject(error);
		}
	});
};

module.exports = getUrl;
