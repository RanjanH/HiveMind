import fs from "fs";
import db from "./database.js";

// Read users.json file 
let users;
fs.readFile("methods/users.json", function(err, data) { 
	if (err) throw err; 

	users = JSON.parse(data); 
});

async function submit(data){
    try{
        if (users.user === "student"){
            users.user = 1;
        } else {
            users.user = 2;
        }
        let result = await db.query("INSERT INTO users (uid,email,hash,userno) VALUES ($1, $2, $3, $4)",
            [data.uid, users.email, users.pass, users.user]);
            //console.log(result);
        if(data.year === '1'){
            data.year = 1;
        } else if (data.year === '2'){
            data.year = 2;
        } else if (data.year === '3'){
            data.year = 3;
        }else {
            data.year = 4;
        }
        result = await db.query("INSERT INTO student_details (uid,name,uname,year,branch) VALUES ($1, $2, $3, $4, $5)",
        [data.uid,data.name,data.uname,data.year,data.branch]);
    } catch(e) {
        console.log(e);
    }
}

export default submit;