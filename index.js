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
        let start;
        if (data.userno === 1){
            result = await db.query("SELECT name FROM student_details WHERE uid = $1",[req.cookies.uid]);
            data = result.rows[0];
            start = "stu_";
        } else {
            result = await db.query("SELECT name FROM faculty_details WHERE uid = $1",[req.cookies.uid]);
            data = result.rows[0];
            start = "fac_";
        }
        let eves = await db.query("SELECT * FROM events WHERE who_no = per_no");
        let myeves = await db.query("SELECT * FROM events WHERE uid = $1",[req.cookies.uid]);
        res.render(start + "dashboard.ejs",{name:data.name.slice(0,1).toUpperCase() + data.name.slice(1),dir: 'home',data: eves.rows,mydata: myeves.rows,cur: "home"});
    } else {
        res.redirect("/login");        
    }
})

app.get("/public/images/homebg.jpg", (req,res) => {
    res.sendFile(__dirname + "/public/images/homebg.jpg");
})

app.get('/create-event', async(req, res) => {
    if (req.cookies.uid){
        let result = await db.query("SELECT userno FROM users WHERE uid = $1",[req.cookies.uid]);
        let data = result.rows[0];
        let start;
        if (data.userno === 1){
            result = await db.query("SELECT name FROM student_details WHERE uid = $1",[req.cookies.uid]);
            data = result.rows[0];
            start = "stu_";
        } else {
            result = await db.query("SELECT name FROM faculty_details WHERE uid = $1",[req.cookies.uid]);
            data = result.rows[0];
            start = "fac_";
        }
        res.render(start + "dashboard.ejs",{name:data.name.slice(0,1).toUpperCase() + data.name.slice(1),dir: 'estart',cur: "e-create"});
    } else {
        console.log("huh!!");
        res.redirect("/login");        
    }
})

app.get('/calendar', async(req, res) => {
    if (req.cookies.uid){
        let result = await db.query("SELECT userno FROM users WHERE uid = $1",[req.cookies.uid]);
        let data = result.rows[0];
        let start;
        if (data.userno === 1){
            result = await db.query("SELECT name FROM student_details WHERE uid = $1",[req.cookies.uid]);
            data = result.rows[0];
            start = "stu_";
        } else {
            result = await db.query("SELECT name FROM faculty_details WHERE uid = $1",[req.cookies.uid]);
            data = result.rows[0];
            start = "fac_";
        }
        let eves = await db.query("SELECT * FROM events");
        res.render(start + "dashboard.ejs",{name:data.name.slice(0,1).toUpperCase() + data.name.slice(1),dir: 'calendar',data: eves.rows,cur: "calendar"});
    } else {
        res.redirect("/login");        
    }
})

app.get('/approval', async(req,res) => {
    if(req.cookies.uid){
        let result = await db.query("SELECT name FROM faculty_details WHERE uid = $1",[req.cookies.uid]);
        let data = result.rows[0];
        let uname = await db.query("SELECT uname FROM faculty_details WHERE uid = $1",[req.cookies.uid]);
        let utemp = uname.rows[0].uname;
        let eves = await db.query("SELECT * FROM events");
        let eve = eves.rows;
        let mydata = [];
        for(let i=0; i < eve.length; i++){
            let temp = eve[i].whose;
            if ((temp).includes(utemp)){
                mydata.push(eve[i]);
            }
        }
        res.render("fac_dashboard.ejs",{name:data.name.slice(0,1).toUpperCase() + data.name.slice(1),dir: 'approval',data: mydata,cur: "approval"});
    }
})

app.get('/logout', (req, res) => {
    res.clearCookie('uid');
    res.redirect('/login');
})

app.post('/approval', (req,res) => {
    console.log(req.body);
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

app.post("/create_event", async(req, res) => {
    let data = req.body;
    let whoNo = (data.permission.split(' ')).length;
    data.who_no = whoNo;
    data.uid = req.cookies.uid;
    data.per_no = 0;
    data.time = data.start_time + '-' + data.end_time;
    delete data.start_time;
    delete data.end_time;
    data.date = data.dd + '/' + data.mm + '/' + data.yyyy;
    delete data.dd;
    delete data.mm;
    delete data.yyyy;
    try{
        let result = await db.query("SELECT * FROM events WHERE club = $1",[data.cname]);
        if(result.rows.length > 0){
            for(let i = 0; i < result.rows.length; i++){
                if(result.rows[i].name === data.ename){
                    res.send("Event has already been created");
                }
            }
        } else{
            result = await db.query("INSERT INTO events (name,club,date,time,descr,venue,whose,who_no,per_no,uid,link) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)",
                [data.ename,data.cname,data.date,data.time,data.description,data.start_venue,data.permission,data.who_no,data.per_no,data.uid,data.form]);
                res.send('<script>alert(Form Submitted Successfully)</script>');
        }
    } catch(e) {
        console.log(e);
    }
    
})

app.listen(port, () => {
    console.log(`Server is running on Port ${port}....`);
});