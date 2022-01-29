const mongoose = require("mongoose");
const MONGO_PASSWORD = process.env['MONGO_PASSWORD'];

// TODO: move to .env/sec
// TODO: use async await instead of then/catch-done

const URL = `mongodb+srv://MadhushreeKunder:${MONGO_PASSWORD}@madhushree-cluster.9d6tj.mongodb.net/inventory?retryWrites=true&w=majority`

async function initialiseDBConnection(){
  try {
    const connection = await mongoose.connect(URL, {
     useUnifiedTopology: true,
     useNewUrlParser: true,
        })
        if(connection){
          console.log("successfully connected")
        }
      }
catch(error){
  (error => console.error("mongoose connection failed", error))
  }
}

module.exports = {initialiseDBConnection}