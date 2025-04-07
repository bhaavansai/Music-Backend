const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");
const dotenv=require("dotenv").config();
const cors = require('cors');

connectDb();
const app=express();
const port=process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); 
app.use("",require("./routes/resourceLibRoutes"));
app.use("",require("./routes/userRoutes"));
app.use("",require("./routes/tutorRoutes"));
app.use("",require("./routes/adminRoutes"));
app.use("",require("./routes/sessionRoutes"));
app.use(errorHandler);

app.listen(port,()=>{
   console.log(`server running on port ${port}`);
});
app.use(cors({
   origin: 'http://localhost:5173', 
 }));