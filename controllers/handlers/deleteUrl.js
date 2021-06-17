const SURL_DB = require("../../queries/surl_list");
const URL_STORE = require("../../store/urlStore");

const deleteUrl = async (shortUrlId) => {
	URL_STORE.del(shortUrlId);
	const [ok, error] = await SURL_DB.deleteUrl(shortUrlId);
	if (error !== null) {
		// Log error
	}
	return;
};

module.exports = deleteUrl;
