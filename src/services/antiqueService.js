import express from "express";
import { poolPromise } from "../db.js";

const router = express.Router();

// GET all antiques
router.get("/antiques", async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query("SELECT * FROM Antique");
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST create antique
router.post("/antiques", async (req, res) => {
    try {
        const { title, category, price, status } = req.body;
        const pool = await poolPromise;

        await pool.request()
            .input("title", title)
            .input("category", category)
            .input("price", price)
            .input("status", status)
            .query(`
                INSERT INTO Antique (title, category, price, status)
                VALUES (@title, @category, @price, @status)
            `);

        res.json({ message: "Antique created" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT update antique
router.put("/antiques/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title, category, price, status } = req.body;

        const pool = await poolPromise;

        const result = await pool.request()
            .input("id", id)
            .input("title", title)
            .input("category", category)
            .input("price", price)
            .input("status", status)
            .query(`
                UPDATE Antique
                SET title=@title, category=@category, price=@price, status=@status
                WHERE antiqueId=@id
            `);

        if (result.rowsAffected[0] === 0) {
            res.status(404).json({ message: "Antique not found" });
        } else {
            res.json({ message: "Antique updated" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE antique
router.delete("/antiques/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await poolPromise;

        const result = await pool.request()
            .input("id", id)
            .query("DELETE FROM Antique WHERE antiqueId=@id");

        if (result.rowsAffected[0] === 0) {
            res.status(404).json({ message: "Antique not found" });
        } else {
            res.json({ message: "Antique deleted" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
