import express from "express";
import { poolPromise } from "../db.js";

const router = express.Router();

// GET all disputes
router.get("/disputes", async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query("SELECT * FROM Dispute");
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST create dispute
router.post("/disputes", async (req, res) => {
    try {
        const { auctionId, reason, evidence, status, history } = req.body;
        const pool = await poolPromise;

        await pool.request()
            .input("auctionId", auctionId)
            .input("reason", reason)
            .input("evidence", evidence)
            .input("status", status)
            .input("history", history)
            .query(`
                INSERT INTO Dispute (auctionId, reason, evidence, status, history)
                VALUES (@auctionId, @reason, @evidence, @status, @history)
            `);

        res.json({ message: "Dispute created" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
