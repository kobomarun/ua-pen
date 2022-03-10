import { MongoClient, ObjectId } from "mongodb";

const dbName = "ua";
const url = `mongodb+srv://kobo:asdfasdf123@cluster0.tt47l.mongodb.net/ua?retryWrites=true&w=majority`;

const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function connect() {
  if (!client.isConnected()) await client.connect();
  const db = client.db(dbName);
  return { db, client };
}

export { connect, ObjectId };
