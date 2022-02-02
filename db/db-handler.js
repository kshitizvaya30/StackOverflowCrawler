// const { MongoClient } = require('mongodb');
// const uri = "mongodb+srv://kshitiz:kshitiz@cluster0.prifr.mongodb.net/stackoverflow?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// let _db;

// function isConnected() {
//   return !!client && !!client.topology && client.topology.isConnected()
// }

// client.on('serverClosed', (event) => {
//   // eslint-disable-next-line no-console
//   console.log('received serverClosed');
//   // eslint-disable-next-line no-console
//   console.log(JSON.stringify(event, null, 2));
// });

// const mongoDBConnection = async () => {
//   try {
//     if (isConnected()) {
//       _db = client.db("stackoverflow");
//       return client.db("stackoverflow");
//     }

//     await client.connect();
//     _db = client.db("stackoverflow");
//     return client.db("stackoverflow");
//   } catch (error) {
//     return Promise.reject(error);
//   }
// };

// const dbObj = () => _db;

// module.exports = {
//   mongoDBConnection,
//   dbObj,
// };

//Import the mongoose module
var mongoose = require("mongoose");
const mongoDB =
  "mongodb+srv://kshitiz:kshitiz@cluster0.prifr.mongodb.net/stackoverflow?retryWrites=true&w=majority";

const mongoDBConnection = async () => {
  //Set up default mongoose connection
  mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  mongoose.connection.on("connected", function () {
    console.log(
      `Database connection open to ${mongoose.connection.host} ${mongoose.connection.name}`
    );
  });

  mongoose.connection.on("error", function (err) {
    console.log("Mongoose default connection error: " + err);
  });

  mongoose.connection.on("disconnected", function () {
    console.log("Mongoose default connection disconnected");
  });
  //Get the default connection
  // var db = mongoose.connection;
  return mongoose.connection;
};

module.exports = {
  mongoDBConnection,
};
