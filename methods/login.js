import db from "./database.js";
import bcrypt from "bcrypt";

async function authenticate(email,pass,res){
    try{
        const result = await db.query("SELECT * FROM users WHERE email = $1",[email]);

        if (result.rows.length > 0){
            const user = result.rows[0];
            const dbPass = user.password;

            bcrypt.compare(pass, dbPass, (e, result) => {
                if(e){
                    console.log(e);
                } else {
                    if (res){
                        res.send("Successfully Logged In");
                        return
                    } else {
                        res.send("Email or Password is incorrect");
                        return
                    }
                }
            })
            
        } else {
            res.send("User Not Found");
            return
        }
    } catch(e) {
        console.log(e);
    }
}

export default authenticate; 