const express = require("express");
const app = express();
const path = require("path");
const mysql = require("mysql2");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

// Use a REMOTE MySQL connection instead of "localhost"
const connection = mysql.createConnection({
    host: "sql12.freesqldatabase.com", 
    user: "sql12766641",
    database: "game",
    port: 3306,
    password: "WN4aKHaInp"
});

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.post("/register", (req, res) => {
    let { userName, userEmail, userPassword } = req.body;
    let q = "INSERT INTO user (username, email, userpass) VALUES (?, ?, ?)";

    try {
        connection.query(q, [userName, userEmail, userPassword], (err, result) => {
            if (err) {
                if (err.code === "ER_DUP_ENTRY") {
                    const duplicateField = err.sqlMessage.match(/key '(.*)'/)[1];
                    if (duplicateField === "user.username") {
                        res.send("<script>alert('Username already exists'); window.location.href = '/';</script>");
                        return;
                    } else if (duplicateField === "user.email") {
                        res.send("<script>alert('Email already exists'); window.location.href = '/';</script>");
                        return;
                    }
                } else {
                    res.send("<script>alert('Internal Server Error'); window.location.href = '/';</script>");
                    return;
                }
            }
            res.redirect("/");
        });
    } catch (err) {
        res.send("Some error in DB");
    }
});

app.post("/login", (req, res) => {
    let { loginName, loginPassword } = req.body;
    let q = `SELECT * FROM user WHERE username='${loginName}'`;

    connection.query(q, (err, result) => {
        if (err) {
            res.send("<script>alert('Internal Server Error'); window.location.href = '/';</script>");
            return;
        }

        if (result.length > 0 && loginName === result[0].username && loginPassword === result[0].userpass) {
            res.redirect("/game");
        } else {
            res.send("<script>alert('Login failed: Incorrect username or password.'); window.location.href = '/';</script>");
        }
    });
});

app.get("/game", (req, res) => {
    res.render("game.ejs");
});

// REMOVE `app.listen(8080)` for Vercel
