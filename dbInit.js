import sql from "mssql";

const config = {
    user: "sa",
    password: "YourPassword123!",
    server: "localhost",
    database: "master",
    options: { encrypt: false },
};

async function initDB() {
    try {
        const pool = await sql.connect(config);
        await pool.request().query(`CREATE DATABASE AntiquesAuctionDB`);
        console.log("Database AntiquesAuctionDB created successfully!");
        sql.close();
    } catch (err) {
        console.error(err);
    }
}

initDB();
