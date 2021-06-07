var axios = require("axios");

const DB_URL = process.env.DB_URL;
const BASIC_AUTH =
	"Basic " +
	Buffer.from(
		process.env.DB_USERNAME + ":" + process.env.DB_PASSWORD
	).toString("base64");
const DB_NAME = process.env.DB_NAME;
const SURL_TABLE = "surl_table";

const DB_CONFIG = {
	method: "post",
	url: DB_URL,
	headers: {
		"Content-Type": "application/json",
		Authorization: BASIC_AUTH,
	},
};

const createTable = () => {
	const data = JSON.stringify({
		operation: "create_table",
		schema: DB_NAME,
		table: SURL_TABLE,
		hash_attribute: "id",
	});

	let config = { ...DB_CONFIG, data };

	axios(config)
		.then((response) => {
			const { message, error } = response.data;
			if (error) {
				console.log("CREATE TABLE ERROR: " + error);
			} else {
				console.log("CREATE TABLE INFO: " + message);
			}
		})
		.catch((error) => {
			console.log("CATCH CREATE TABLE ERROR: " + error.message);
		});
};

const insertUrl = (surlID, url) => {
	return new Promise((resolve, reject) => {
		const hits = 0;
		const query = `INSERT INTO ${DB_NAME}.${SURL_TABLE} (id, url, hits) VALUE ('${surlID}', '${url}', ${hits})`;
		const data = JSON.stringify({
			operation: "sql",
			sql: query,
		});

		let config = { ...DB_CONFIG, data };

		axios(config)
			.then((response) => {
				const { inserted_hashes } = response.data;
				if (inserted_hashes.length > 0) {
					return resolve(surlID);
				} else {
					return resolve(null);
				}
			})
			.catch((error) => {
				console.log("INSERT ERROR: " + error.message);
				return reject("Something went wrong");
			});
	});
};

const getOriginalUrl = (surlID) => {
	return new Promise((resolve, reject) => {
		const query = `SELECT url, hits FROM ${DB_NAME}.${SURL_TABLE} WHERE id='${surlID}'`;
		const data = JSON.stringify({
			operation: "sql",
			sql: query,
		});

		let config = { ...DB_CONFIG, data };

		axios(config)
			.then((response) => {
				const result = response.data;
				if (result.length > 0) {
					return resolve(result[0]);
				}
				return reject("URL not found");
			})
			.catch((error) => {
				console.log("GET ORIGINAL URL ERROR: " + error.message);
				return reject("Something went wrong");
			});
	});
};

const doesUrlExist = (originalUrl) => {
	return new Promise((resolve, reject) => {
		const query = `SELECT id FROM ${DB_NAME}.${SURL_TABLE} WHERE url='${originalUrl}'`;
		const data = JSON.stringify({
			operation: "sql",
			sql: query,
		});

		let config = { ...DB_CONFIG, data };

		axios(config)
			.then((response) => {
				const result = response.data;
				if (result.length > 0) {
					return resolve(result[0].id);
				}
				return resolve(null);
			})
			.catch((error) => {
				console.log("URL EXISTS ERROR: " + error.message);
				return reject("Something went wrong");
			});
	});
};

const updateUrlHits = (surlId, hits) => {
	const query = `UPDATE ${DB_NAME}.${SURL_TABLE} SET hits=${hits} WHERE id='${surlId}'`;
	const data = JSON.stringify({
		operation: "sql",
		sql: query,
	});

	let config = { ...DB_CONFIG, data };

	axios(config)
		.then((response) => {})
		.catch((error) => {
			console.log("UPDATE HITS ERROR: " + error.message);
		});
};

module.exports = {
	createTable,
	insertUrl,
	getOriginalUrl,
	doesUrlExist,
	updateUrlHits,
};
