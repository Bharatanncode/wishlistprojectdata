const express=require('express')
const mongoose = require("mongoose");
const cors = require('cors');
require('dotenv').config();

//WishListProject API
const WishListProject = require('./Router/post')

// Create a new Express Instance
const app = express();// express module, you can check your express version
app.use(express.json());// Without this middleware
app.use(cors());

//Enable CORS for all HTTP methods
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    res.header('Access-Control-Allow-Credentials', true)  ;   
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept",
    );
    next();
  });
  
//DB connection code.......
mongoose.set("strictQuery", false);
let DBURL = process.env.MONGODB_URI;
mongoose.connect(DBURL, {
  useNewUrlParser: true,
})
.then(() => {
  console.log("Successfully connected to the Database");
})
.catch((err) => {
  console.log("Could not connect to the database. Exiting now...", err);
});

//API call
app.use('/api',WishListProject);

// Port Connection Code...............................
const port= process.env.PORT || 8081;

app.listen(port, () => {
  console.log("Your  Port on  8081");
});

