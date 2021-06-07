const { insertUrl, doesUrlExist } = require("../db/query");
const generateSurl = require("../helpers/generateSurl");
const isValidURL = require("../helpers/isValidURL");

const shortenUrl = (url) => {
	return new Promise(async (resolve, reject) => {
		if (!url) {
			return reject("URL is required");
		}
		if (!isValidURL(url)) {
			return reject("URL is not valid");
		}
		if (url[url.length - 1] === "/") {
			url = url.slice(0, url.length - 1);
		}
		const reGenLimit = 10;
		let surlId = null;
		try {
			surlId = await doesUrlExist(url);
			if (surlId) {
				return resolve(surlId);
			}
		} catch (error) {
			return reject(error);
		}
		for (let i = 0; i < reGenLimit; i++) {
			surlId = generateSurl();
			try {
				surlId = await insertUrl(surlId, url);
				if (surlId) {
					resolve(surlId);
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

module.exports = shortenUrl;
