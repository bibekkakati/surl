const CREDS = process.env.DB_USERNAME + ":" + process.env.DB_PASSWORD;
const BASIC_AUTH = "Basic " + Buffer.from(CREDS).toString("base64");

const DB_CONFIG = {
	method: "post",
	url: process.env.DB_URL,
	headers: {
		"Content-Type": "application/json",
		Authorization: BASIC_AUTH,
	},
};

module.exports = DB_CONFIG;
