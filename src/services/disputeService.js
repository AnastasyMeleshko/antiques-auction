import express from "express";
import { poolPromise } from "../db.js";

const router = express.Router();

// GET все споры
router.get("/disputes", async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query("SELECT * FROM Disputes");
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST создать спор
router.post("/disputes", async (req, res) => {
    try {
        const { auction_id, user_id, reason, evidence_url, status } = req.body;
        const pool = await poolPromise;
        await pool.request()
            .input("auction_id", auction_id)
            .input("user_id", user_id)
            .input("reason", reason)
            .input("evidence_url", evidence_url)
            .input("status", status || "open")
            .query(`INSERT INTO Disputes (auction_id, user_id, reason, evidence_url, status) 
              VALUES (@auction_id, @user_id, @reason, @evidence_url, @status)`);
        res.json({ message: "Dispute created" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT обновить спор
router.put("/disputes/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const pool = await poolPromise;
        const result = await pool.request()
            .input("id", id)
            .input("status", status)
            .query("UPDATE Disputes SET status=@status WHERE id=@id");

        if (result.rowsAffected[0] === 0) {
            res.status(404).json({ message: "Dispute not found" });
        } else {
            res.json({ message: "Dispute updated" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE спор
router.delete("/disputes/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await poolPromise;
        const result = await pool.request()
            .input("id", id)
            .query("DELETE FROM Disputes WHERE id=@id");

        if (result.rowsAffected[0] === 0) {
            res.status(404).json({ message: "Dispute not found" });
        } else {
            res.json({ message: "Dispute deleted" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
