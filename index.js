const express = require("express");
const path = require("path");
const app = express();

app.set("views engine", "ejs");
app.set("views", path.join(__dirname, "/views"));


app.get("/login", (req,res) => {
    res.send("Success");
});


app.listen("8080", ()=> {
    console.log("App is working");
})
