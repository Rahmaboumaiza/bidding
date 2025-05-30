const dotenv = require ("dotenv").config();
const express = require ("express");
const mongoose= require ("mongoose");
const bodyParser= require ("body-parser");
const cors = require ("cors");
const path = require ("path");
const cookieParser =require("cookie-parser");
const userRoute=require("./routes/userRoutes");
const productRoute=require("./routes/productRoute");
const biddingRoute=require("./routes/biddingRoute");
const categoryRoute=require("./routes/categoryRoute");
const errorHandler=require("./middleware/errorMiddleWare")


const app =express();


app.use(express.json());
app.use(cookieParser());

app.use(
    express.urlencoded({
        extended: false,
    })
);
app.use(bodyParser.json());

app.use(
    cors({
        origin:["http://localhost:3000"],
        credentials:true,
    })
);


const Port = process.env.Port|| 5000 ;

app.use("/api/users" ,userRoute);
app.use("/api/product" ,productRoute);
app.use("/api/bidding" ,biddingRoute);
app.use("/api/category", categoryRoute);

app.use(errorHandler);
app.use("/uploads",express.static(path.join(__dirname,"uploads")));

app.get("/",(req,res)=>{
res.send("home pages");
} );


mongoose
.connect(process.env.DATABASE_CLOUD)
.then(()=>{
app.listen(Port ,()=>{
    console.log(`server running on port ${Port}`);
});
})
.catch((err)=>{
    console.log(err);
});
