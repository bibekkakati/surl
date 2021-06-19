require("dotenv").config();
const compression = require("compression");
const express = require("express");
const app = express();
const helmet = require("helmet");
const path = require("path");
const SURL_DB = require("./queries/surl_list");
const SERVER_LIST_DB = require("./queries/server_list");
const cors = require("./config/cors");
const apiLimiter = require("./config/rateLimiter");
const cookieParser = require("cookie-parser");

app.enable("trust proxy");
app.use(compression());
app.use(helmet());
app.use(cors);
app.use(cookieParser());

app.use("/api/", apiLimiter);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(
	express.static(path.join(__dirname, "public"), {
		maxAge: 432000000, // 5 Days
		etag: true,
	})
);

app.use("/", require("./controllers/routes").clientRoutes);
app.use("/api/url", require("./controllers/routes").urlRoutes);

const PORT = process.env.PORT;
const SERVER_ID = process.env.SERVER_ID;

const server = app.listen(PORT, async () => {
	await SURL_DB.createTable();
	await SERVER_LIST_DB.createTable();
	await SERVER_LIST_DB.insertServerId(SERVER_ID);

	console.log("Server is running at http://localhost:" + PORT);
});

const handleExit = async (signal) => {
	console.log(`Received ${signal}. Closing server gracefully.`);
	server.close((err) => {
		if (err) console.error(err);
		process.exit(1);
	});
};
process.on("SIGINT", handleExit);
process.on("SIGQUIT", handleExit);
process.on("SIGTERM", handleExit);
