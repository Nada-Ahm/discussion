const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("upload"))
const cors = require("cors");
app.use(cors())
const auth=require("./routes/Auth");
const medicines=require("./routes/Medicines");
const Categories=require("./routes/Categories")
const Patient=require("./routes/Patient")
app.listen(4000,"localhost",()=>
{
    console.log("server is running");
});
app.use("/auth",auth);
app.use("/medicines",medicines);
app.use("/categories",Categories);
