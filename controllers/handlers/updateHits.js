const SURL_DB = require("../../queries/surl_list");
const URL_STORE = require("../../store/urlStore");

const updateHits = async (shortUrlId, data) => {
	const [ok, error] = await SURL_DB.updateUrlHits(
		shortUrlId,
		data.hits,
		data.visitors
	);
	if (error !== null) {
		// Log error
		return;
	}
	URL_STORE.set(shortUrlId, data);
	return;
};

module.exports = updateHits;
