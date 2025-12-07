import sql from "mssql";

export const config = {
    user: "sa",
    password: "YourPassword123!",
    server: "localhost",
    port: 1433,
    database: "AntiquesAuctionDB",
    options: {
        encrypt: false,
        trustServerCertificate: true,
    },
};

export const poolPromise = sql.connect(config)
    .then(pool => {
        console.log("DB Connected");
        return pool;
    })
    .catch(err => {
        console.error("DB Connection Failed", err);
        process.exit(1);
    });
