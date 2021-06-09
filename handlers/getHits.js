const { getUrlHits } = require("../db/query");
const urlStore = require("../store/urlStore");

const getHits = async (surlId) => {
	if (!surlId) {
		return [null, "Invalid Surl ID"];
	}
	const data = urlStore.get(surlId);
	// Cache hit
	if (data && data.hits >= 0) {
		return [data.hits, null];
	}
	//Cache miss
	const [result, error] = await getUrlHits(surlId);
	if (error !== null) {
		return [null, error];
	}
	return [result, null];
};

module.exports = getHits;
