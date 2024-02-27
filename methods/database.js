import pg from "pg";

let db;

try{
    db = new pg.Client({
        user: "postgres",
        host: "localhost",
        database: "hivemind",
        password: "Alok@1234"
    })

    db.connect();

    console.log("Database Connected!");

} catch(e) {
    console.log("Error connecting to database");
}

export default db;