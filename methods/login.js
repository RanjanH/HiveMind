import db from "./database.js";

async function authenticate(email,pass,res){
    console.log(email+' '+pass);
    try{
        const result = await db.query("SELECT * FROM users WHERE email = $1",[email]);

        if (result.rows.length > 0){
            const user = result.rows[0];
            const dbPass = user.password;

            if (dbPass === pass){
                res.send("Successfully Logged In");
                return
            } else {
                res.send("Email or Password is incorrect");
                return
            }
        } else {
            res.send("User Not Found");
            return
        }
    } catch(e) {
        console.log(e);
    }
}

export default authenticate; 