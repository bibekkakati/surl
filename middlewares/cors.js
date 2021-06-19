const cors = require("cors");

module.exports = cors({
	origin:
		process.env.NODE_ENV === "development"
			? "http://localhost:" + process.env.PORT
			: "https://surl.bibekkakati.me",
	optionsSuccessStatus: 200,
	methods: ["GET"],
	maxAge: 3 * 60,
});
