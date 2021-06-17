const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const getUniqueKey = require("../../helpers/getUniqueKey");
const packageDefinition = protoLoader.loadSync(
	__dirname + "/proto/key.proto",
	{}
);
const grpcObject = grpc.loadPackageDefinition(packageDefinition);
const KeyPackage = grpcObject.KeyPackage;

const SERVER_ID = process.env.SERVER_ID;

const client = new KeyPackage.Key(
	"localhost:6000",
	grpc.credentials.createInsecure()
);

const getKeys = () => {
	return new Promise((resolve, reject) => {
		client.getKeys({ id: SERVER_ID }, (err, res) => {
			if (err) {
				return resolve([null, err]);
			}
			return resolve([res.keys, null]);
		});
	});
};

module.exports = {
	getKeys,
};
