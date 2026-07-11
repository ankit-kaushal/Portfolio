import mongoose from "mongoose";

const cluster = process.env.DB_CLUSTER;
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;

const MONGO_URI = `mongodb+srv://${username}:${password}@${cluster}.hcapf5i.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=${cluster}`;

let cached = global.mongoose;

if (!cached) {
	cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
	if (cached.conn) {
		return cached.conn;
	}

	if (!cached.promise) {
		cached.promise = mongoose.connect(MONGO_URI).then((mongooseInstance) => {
			return mongooseInstance;
		});
	}

	cached.conn = await cached.promise;
	return cached.conn;
}
