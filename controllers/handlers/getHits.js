const { getUrlHits } = require("../../db/query");
const urlStore = require("../../store/urlStore");

const getHits = async (shortUrlId) => {
	if (!shortUrlId) {
		return [null, "Invalid Surl ID"];
	}
	const data = urlStore.get(shortUrlId);
	// Cache hit
	if (data && data.hits >= 0) {
		return [data.hits, null];
	}
	//Cache miss
	const [result, error] = await getUrlHits(shortUrlId);
	if (error !== null) {
		return [null, error];
	}
	return [result, null];
};

module.exports = getHits;
