import db from "./database.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

const saltRounds = 10;

async function register(email,pass,res){
    try{
        const result = await db.query("SELECT * FROM users WHERE email = $1",[email]);

        if (result.rows.length > 0){
            res.send("This email is already linked with another account");
        } else {
            const uid = crypto.randomUUID();
            bcrypt.hash(pass, saltRounds, async(e, hash) => {
                if (e){
                    console.log("Error while hashing :", e);
                } else {
                    const result = db.query("INSERT INTO users (uid,email, password) VALUES ($1, $2, $3)",
                    [uid,email,hash]);
                    console.log(result);
                    res.send("Registered Successfully");
                }
            })
        }
    } catch(e) {
        console.log(e);
    }
}

export default register;