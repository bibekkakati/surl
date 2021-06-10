const axios = require("axios");

const Agent = require("agentkeepalive");
const keepAliveAgent = new Agent({
	maxSockets: 100,
	maxFreeSockets: 10,
	timeout: 60000 * 15, // active socket keepalive for 15 minutes
	freeSocketTimeout: 30000, // free socket keepalive for 30 seconds
});

const axiosInstance = axios.create({ httpAgent: keepAliveAgent });

module.exports = axiosInstance;
