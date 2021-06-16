require("dotenv").config();
const express = require("express");
const app = express();
const helmet = require("helmet");
const path = require("path");
const { createTable } = require("./db/query");
const cors = require("./config/cors");
const apiLimiter = require("./config/rateLimiter");
const cookieParser = require("cookie-parser");

app.enable("trust proxy");
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
const server = app.listen(PORT, () => {
	createTable();
	console.log("Server is running at http://localhost:" + PORT);
});

const handleExit = async (signal) => {
	console.log(`Received ${signal}. Closing server gracefully.`);
	console.log("Closing HTTP server");
	server.close((err) => {
		if (err) console.error(err);
		console.log("HTTP server closed");
		process.exit(0);
	});
};
process.on("SIGINT", handleExit);
process.on("SIGQUIT", handleExit);
process.on("SIGTERM", handleExit);
