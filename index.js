const express = require("express");
const app = express();
const path = require("path");
const mysql = require("mysql2");

app.set("views engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "game",
    password: "Pote_1234"
});

app.get("/register", (req,res)=>{
    res.render("login.ejs");   
})

app.post("/register", (req,res) => {
    let {userName,userEmail,userPassword} = req.body;
    res.send("Success");
});


app.listen("8080", ()=> {
    console.log("App is working");
})


