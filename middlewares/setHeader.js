const setHeader = async (req, res, next) => {
	// Be default response are non-cacheable
	res.set("Cache-Control", "noCache");
	next();
};

module.exports = setHeader;
