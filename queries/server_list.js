const request = require("../config/request");
const DB_CONFIG = require("../config/database");

const DB_NAME = process.env.DB_NAME;
const SERVER_LIST_TABLE = "server_list";

const COL_ID = "id";

const createTable = async () => {
	const data = JSON.stringify({
		operation: "create_table",
		schema: DB_NAME,
		table: SERVER_LIST_TABLE,
		hash_attribute: "id",
	});

	const config = { ...DB_CONFIG, data };

	try {
		const response = await request(config);
		const { message, error } = response.data;
		if (error) {
			console.log("CREATE TABLE ERROR: " + error);
		} else {
			console.log("CREATE TABLE INFO: " + message);
		}
	} catch (error) {
		console.log("CATCH CREATE TABLE ERROR: " + error.message);
	}
};

const insertServerId = async (id) => {
	if (!id) {
		throw new Error("INSERT URL QUERY: args missing");
	}
	const data = JSON.stringify({
		operation: "insert",
		schema: DB_NAME,
		table: SERVER_LIST_TABLE,
		records: [
			{
				[COL_ID]: id,
			},
		],
	});

	const config = { ...DB_CONFIG, data };

	try {
		const response = await request(config);
		const { inserted_hashes } = response.data;
		if (inserted_hashes.length > 0) {
			console.log("Registered the server: ", id);
		} else throw new Error("Server ID already exists");
	} catch (error) {
		console.log("CATCH SERVER REGISTRATION: " + error.message);
		process.exit(1);
	}
};

module.exports = {
	createTable,
	insertServerId,
};
