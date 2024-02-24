import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
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

app.post("/submit", (req, res) => {
    console.log(req.body);
    console.log(typeof(req.body));
})

app.listen(port, () => {
    console.log(`Server is running on Port ${port}....`);
});