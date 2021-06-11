const getUniqueKey = require("../helpers/getUniqueKey");

const KEY_STORE = [];

const get = () => {
	let key = KEY_STORE.pop() || getUniqueKey();
	if (KEY_STORE.length <= 0) {
		generateKeys();
	}
	return key;
};

const generateKeys = async () => {
	for (let i = 0; i < 100; i++) {
		KEY_STORE.push(getUniqueKey());
	}
};

module.exports = {
	get,
};
