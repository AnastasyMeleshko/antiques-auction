import sql from "mssql";

const config = {
    user: "sa",
    password: "YourPassword123!",
    server: "localhost",
    database: "AntiquesAuctionDB",
    options: { encrypt: false },
};

async function createTables() {
    try {
        const pool = await sql.connect(config);

        await pool.request().query(`
      CREATE TABLE Users (
        id INT IDENTITY PRIMARY KEY,
        name NVARCHAR(100),
        email NVARCHAR(100),
        balance DECIMAL(10,2)
      );

      CREATE TABLE Antiques (
        id INT IDENTITY PRIMARY KEY,
        title NVARCHAR(100),
        category NVARCHAR(50),
        description NVARCHAR(255),
        starting_price DECIMAL(10,2),
        status NVARCHAR(20) DEFAULT 'available'
      );

      CREATE TABLE Auctions (
        id INT IDENTITY PRIMARY KEY,
        antique_id INT FOREIGN KEY REFERENCES Antiques(id),
        start_time DATETIME,
        end_time DATETIME,
        status NVARCHAR(20) DEFAULT 'active'
      );

      CREATE TABLE Bids (
        id INT IDENTITY PRIMARY KEY,
        auction_id INT FOREIGN KEY REFERENCES Auctions(id),
        user_id INT FOREIGN KEY REFERENCES Users(id),
        amount DECIMAL(10,2),
        created_at DATETIME DEFAULT GETDATE(),
        is_leading BIT DEFAULT 0
      );

      CREATE TABLE Disputes (
        id INT IDENTITY PRIMARY KEY,
        auction_id INT FOREIGN KEY REFERENCES Auctions(id),
        user_id INT FOREIGN KEY REFERENCES Users(id),
        reason NVARCHAR(255),
        evidence_url NVARCHAR(255),
        status NVARCHAR(20) DEFAULT 'open',
        created_at DATETIME DEFAULT GETDATE()
      );

      CREATE TABLE DisputeHistory (
        id INT IDENTITY PRIMARY KEY,
        dispute_id INT FOREIGN KEY REFERENCES Disputes(id),
        status NVARCHAR(20),
        changed_at DATETIME DEFAULT GETDATE()
      );

      INSERT INTO Users (name, email, balance) VALUES
        ('Alice', 'alice@example.com', 1000),
        ('Bob', 'bob@example.com', 1500),
        ('Charlie', 'charlie@example.com', 2000);

      INSERT INTO Antiques (title, category, description, starting_price) VALUES
        ('Vintage Clock', 'Clock', 'Old vintage clock', 100),
        ('Antique Vase', 'Vase', 'Chinese vase from 19th century', 500);

      INSERT INTO Auctions (antique_id, start_time, end_time) VALUES
        (1, GETDATE(), DATEADD(day, 7, GETDATE())),
        (2, GETDATE(), DATEADD(day, 5, GETDATE()));
    `);

        console.log("Tables and mock data created successfully!");
        sql.close();
    } catch (err) {
        console.error(err);
    }
}

createTables();
