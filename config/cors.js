const cors = require("cors");

module.exports = cors({
	origin:
		process.env.NODE_ENV === "development"
			? "http://localhost:" + process.env.PORT
			: "https://ursurl.herokuapp.com",
	optionsSuccessStatus: 200,
	methods: ["GET"],
	maxAge: 3 * 60,
});
