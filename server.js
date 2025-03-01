
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
    res.render("index.ejs");   
})

app.post("/register",(req,res)=>{
    let {userName , userEmail , userPassword} = req.body;

    let q="INSERT INTO user (username,email,userpass) VALUES (?,?,?)"
    try {
        connection.query(q,[userName,userEmail,userPassword], (err, result) => {
            if (err) {
                if(err.code === 'ER_DUP_ENTRY'){
                    const duplicateField = err.sqlMessage.match(/key '(.*)'/)[1];
                    if(duplicateField === 'user.username'){
                        res.send("<script>alert('Username already exist'); window.location.href = '/';</script>");
                        return;
                    }
                    else if(duplicateField === 'user.email'){
                        res.send("<script>alert('Email already exist'); window.location.href = '/';</script>");
                        return;
                    }
                }else{
                    res.send("<script>alert('Internal Server Error'); window.location.href = '/';</script>");
                    return;
                }
            }

            res.redirect("/")
        });
    } catch (err) {
        res.send("some error in DB")
    }
})

app.post("/login", (req, res) => {
    let { loginName } = req.body;
    let { loginPassword } = req.body;

    let q = `SELECT * FROM user WHERE username='${loginName}'`;

    connection.query(q, (err, result) => {
        if (err) {
            res.send("<script>alert('Internal Server Error'); window.location.href = '/';</script>");
            return;
        }

        if (result.length > 0 && loginName === result[0].username && loginPassword === result[0].userpass) {
            res.send("<script>alert('Login successful!'); window.location.href = '/';</script>");
        } else {
            res.send("<script>alert('Login failed: Incorrect username and password or no user found.'); window.location.href = '/';</script>");
        }
    });
});



app.listen("8080", ()=> {
    console.log("App is working");
})