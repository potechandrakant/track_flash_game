
const express = require("express");
const app = express();
const path = require("path");
const mysql = require("mysql2");

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.set("views engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "game",
    password: "mahesh@2005"
});

app.get("/", (req,res)=>{
    res.render("home.ejs");   
})

app.post("/register",(req,res)=>{
    let {userName , userEmail , userPassword} = req.body;
    console.log(userName);

    let q="INSERT INTO user (username,email,userpass) VALUES (?,?,?)"
    try {
        connection.query(q,[userName,userEmail,userPassword], (err, result) => {
            if (err) throw err;
            console.log(result);
            res.redirect("/")
        });
    } catch (err) {
        console.log(err);
        res.send("some error in DB")
    }
})



app.listen("8080", ()=> {
    console.log("App is working");
})