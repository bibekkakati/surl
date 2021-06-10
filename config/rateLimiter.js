const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 10,
});

module.exports = apiLimiter;
