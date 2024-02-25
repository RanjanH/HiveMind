import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import register from "./methods/signup.js";
import submit from "./methods/userDetails.js";
import db from "./methods/database.js";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 8080;

app.use(cookieParser());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'html');

app.get('/',(req, res) => {
    res.redirect('/login');
});

app.get('/try',(req,res) => {
    res.render("try.ejs",{name:''});
})

app.get('/login', (req, res) => {
    try{
        if(req.cookies.uid){
            res.redirect('/home');
        } else {
            res.sendFile(__dirname + '/public/login.html');
        }
    } catch(e) {
        res.sendFile(__dirname + '/public/login.html');
    }
})

app.get("/loginError", (req, res) => {
    res.sendFile(__dirname + "/public/loginError.html");
})

app.get("/signup", (req,res) => {
    res.sendFile(__dirname + "/public/signup.html");
})

app.get("/userDetails", (req, res) => {
    res.sendFile(__dirname + "public/userDetails.html")
})

app.get("/home", async(req, res) => {
    if (req.cookies.uid){
        let result = await db.query("SELECT userno FROM users WHERE uid = $1",[req.cookies.uid]);
        let data = result.rows[0];
        if (data.userno === 1){
            result = await db.query("SELECT name FROM student_details WHERE uid = $1",[req.cookies.uid]);
            data = result.rows[0];
        } else {
            result = await db.query("SELECT name FROM faculty_details WHERE uid = $1",[req.cookies.uid]);
            data = result.rows[0];
        }
        res.render("dashboard.ejs",{name:data.name.slice(0,1).toUpperCase() + data.name.slice(1),dir: 'try',cur: "home"});
    } else {
        console.log("huh!!");
        res.redirect("/login");        
    }
})

app.get('/create-event', async(req, res) => {
    if (req.cookies.uid){
        let result = await db.query("SELECT userno FROM users WHERE uid = $1",[req.cookies.uid]);
        let data = result.rows[0];
        if (data.userno === 1){
            result = await db.query("SELECT name FROM student_details WHERE uid = $1",[req.cookies.uid]);
            data = result.rows[0];
        } else {
            result = await db.query("SELECT name FROM faculty_details WHERE uid = $1",[req.cookies.uid]);
            data = result.rows[0];
        }
        res.render("dashboard.ejs",{name:data.name.slice(0,1).toUpperCase() + data.name.slice(1),dir: 'estart',cur: "e-create"});
    } else {
        console.log("huh!!");
        res.redirect("/login");        
    }
})

app.get('/logout', (req, res) => {
    res.clearCookie('uid');
    res.redirect('/login');
})

app.post("/login", async(req, res) => {
    var email = req.body.email;
    var pass = req.body.password;

    try{
        const result = await db.query("SELECT * FROM users WHERE email = $1",[email]);
        if (result.rows.length > 0){
            const user = result.rows[0];
            const dbPass = user.hash;
            bcrypt.compare(pass, dbPass, (e, isMatched) => {
                if(e){
                    console.log(e);
                } else {
                    if (isMatched){
                        res.cookie('uid',user.uid);
                        res.redirect('/home');
                    } else {
                        res.redirect("/loginError");
                    }
                }
            })
        } else {
            res.redirect("/loginError");
        }
    } catch(e) {
        console.log(e);
    }

    /*const flag = await authenticate(email, pass, res);
    
    if (!flag){
        res.redirect("/loginError");
    } else {
        uid = await db.query("SELECT uid FROM users WHERE email = $1",[email]);
        console.log(uid);
    }*/
})

app.post("/register", async(req,res) => {
    let data = req.body;
    delete data.pass2;
    await register(data);
    res.sendFile(__dirname + '/public/userDetails.html');
})

app.post("/details", async(req, res) => {
    await submit(req.body);
    res.cookie('uid',req.body.uid);
    res.redirect("/home");
})

app.listen(port, () => {
    console.log(`Server is running on Port ${port}....`);
});