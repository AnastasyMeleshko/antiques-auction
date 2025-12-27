import sql from "mssql";

export const config = {
    user: "nastassia.mialeshka",
    password: "Sunlove1991$07",
    server: "mialeshkasqlserver.database.windows.net",
    database: "mialeshkaDB",
    options: {
        encrypt: true,
        trustServerCertificate: false
    }
};

export const poolPromise = sql.connect(config)
    .then(pool => {
        console.log("Connected to Azure SQL");
        return pool;
    })
    .catch(err => {
        console.error("Azure SQL Connection Failed", err);
        process.exit(1);
    });
