const { getKeys } = require("../services/keygen/action");

var KEY_STORE = [];

const get = async () => {
	if (KEY_STORE.length <= 0) {
		const [keys, error] = await getKeys();
		if (error !== null) {
			console.error("GET KEYS ERROR: ", error);
			return null;
		}
		KEY_STORE = keys;
	}
	return KEY_STORE.pop();
};

module.exports = {
	get,
};
