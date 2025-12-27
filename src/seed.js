import { poolPromise } from "./db.js";

async function seed() {
    try {
        const pool = await poolPromise;

        console.log("Seeding database...");

        // ⚠️ Очистка таблиц (в правильном порядке)
        await pool.request().query(`
            DELETE FROM Dispute;
            DELETE FROM Bid;
            DELETE FROM Auction;
            DELETE FROM Antique;
            DELETE FROM [User];
        `);

        // 1️⃣ Users
        const usersResult = await pool.request().query(`
            INSERT INTO [User] (email, name)
            OUTPUT INSERTED.userId
            VALUES
            ('alice@example.com', 'Alice'),
            ('bob@example.com', 'Bob'),
            ('charlie@example.com', 'Charlie');
        `);

        const [aliceId, bobId, charlieId] = usersResult.recordset.map(u => u.userId);

        // 2️⃣ Antiques
        const antiquesResult = await pool.request().query(`
            INSERT INTO Antique (title, category, price, status)
            OUTPUT INSERTED.antiqueId
            VALUES
            ('Vintage Clock', 'Decor', 120.00, 'available'),
            ('Silver Spoon', 'Kitchen', 45.50, 'available'),
            ('Oil Painting', 'Art', 300.00, 'available');
        `);

        const [clockId, spoonId, paintingId] = antiquesResult.recordset.map(a => a.antiqueId);

        // 3️⃣ Auctions

        const now = new Date();
        const later = new Date(now.getTime() + 24*60*60*1000); // +1 день
        const defaultStatus = 'open'; // можно 'open' или 'active', зависит от схемы

        const auctionsResult = await pool.request().query(`
    INSERT INTO Auction (antiqueId, userId, startTime, endTime, status)
    OUTPUT INSERTED.auctionId
    VALUES
    (${clockId}, ${aliceId}, '${now.toISOString()}', '${later.toISOString()}', '${defaultStatus}'),
    (${spoonId}, ${bobId}, '${now.toISOString()}', '${later.toISOString()}', '${defaultStatus}'),
    (${paintingId}, ${charlieId}, '${now.toISOString()}', '${later.toISOString()}', '${defaultStatus}');
`);

        const [auction1Id, auction2Id, auction3Id] =
            auctionsResult.recordset.map(a => a.auctionId);


// 4️⃣ Bids
        const defaultBidStatus = 'active'; // статус для всех ставок
        const nowTimestamp = new Date().toISOString(); // timestamp для всех ставок

        const bidsResult = await pool.request().query(`
    INSERT INTO Bid (auctionId, userId, amount, status, timestamp)
    OUTPUT INSERTED.bidId
    VALUES
    (${auction1Id}, ${bobId}, 130.00, '${defaultBidStatus}', '${nowTimestamp}'),
    (${auction1Id}, ${charlieId}, 150.00, '${defaultBidStatus}', '${nowTimestamp}'),
    (${auction2Id}, ${aliceId}, 50.00, '${defaultBidStatus}', '${nowTimestamp}');
`);

        const [bid1Id] = bidsResult.recordset.map(b => b.bidId);

        // 5️⃣ Обновим leadingBidId
        await pool.request().query(`
            UPDATE Auction
            SET leadingBidId = ${bid1Id}
            WHERE auctionId = ${auction1Id};
        `);

        // 6️⃣ Disputes
        await pool.request().query(`
            INSERT INTO Dispute (auctionId, reason, evidence, status, history)
            VALUES
            (${auction1Id}, 'Late delivery', 'Photo proof', 'open', 'Dispute opened'),
            (${auction2Id}, 'Item not as described', 'Chat logs', 'resolved', 'Refund issued');
        `);

        console.log("✅ Database seeded successfully!");
        process.exit(0);

    } catch (err) {
        console.error("❌ Seeding failed:", err);
        process.exit(1);
    }
}

seed();
