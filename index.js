import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import authenticate from "./methods/login.js";
import register from "./methods/signup.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 8080;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/',(req, res) => {
    res.redirect('/login');
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
})

app.get("/signup", (req,res) => {
    res.sendFile(__dirname + "/public/signup.html");
})

app.post("/login", async(req, res) => {
    var email = req.body.email;
    var pass = req.body.password;
    await authenticate(email, pass, res);
})

app.post("/register", async(req,res) => {
    await register(req.body.email,req.body.pass,res);
})

app.listen(port, () => {
    console.log(`Server is running on Port ${port}....`);
});