import db from "./database.js";
import bcrypt from "bcrypt";
import fs from "fs";

function writeJSON(user){
    fs.writeFile(
        "methods/users.json",
        JSON.stringify(user),
        err => {
            if (err) throw err;
            console.log("Done writing");
        });
}

const saltRounds = 10;

async function register(data){
    try{
        const result = await db.query("SELECT * FROM users WHERE email = $1",[data.email]);

        if (result.rows.length > 0){
            //res.send("This email is already linked with another account");
        } else {
            bcrypt.hash(data.pass, saltRounds, async(e, hash) => {
                if (e){
                    console.log("Error :",e);
                } else {
                    let temp = data.pass;
                    data.pass = hash;
                    bcrypt.compare(temp, hash, (e, isMatched) => {
                        if(e){
                            console.log("Error : ",e);
                        } else {
                            console.log("Demo checking : ",isMatched);
                        }
                    })
                    writeJSON(data);
                    return true;
                }
            })
        }
    } catch(e) {
        console.log("Error : ",e);
    }
}

export default register;