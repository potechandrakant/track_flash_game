
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
    password: "Pote_1234"
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

app.post("/login", (req, res) => {
    let { loginName } = req.body;
    let { loginPassword } = req.body;

    let q = `SELECT * FROM user WHERE username='${loginName}'`;

    connection.query(q, (err, result) => {
        if (err) {
            console.error(err);
            res.send("<script>alert('Internal Server Error'); window.location.href = '/';</script>");
            return;
        }

        if (result.length > 0 && loginName === result[0].username && loginPassword === result[0].userpass) {
            res.send("<script>alert('Login successful!'); window.location.href = '/';</script>");
            console.log(result[0].username);
        } else {
            res.send("<script>alert('Login failed: Incorrect username and password or no user found.'); window.location.href = '/';</script>");
            console.log("Login failed: Incorrect username and password or no user found.");
        }
    });
});



app.listen("8080", ()=> {
    console.log("App is working");
})