import express from "express";
import { poolPromise } from "../db.js";

const router = express.Router();

// GET все пользователи
router.get("/users", async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query("SELECT * FROM Users");
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST создать пользователя
router.post("/users", async (req, res) => {
    try {
        const { name, email, balance } = req.body;
        const pool = await poolPromise;
        await pool.request()
            .input("name", name)
            .input("email", email)
            .input("balance", balance)
            .query("INSERT INTO Users (name, email, balance) VALUES (@name, @email, @balance)");
        res.json({ message: "User created" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT обновить пользователя
router.put("/users/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, balance } = req.body;
        const pool = await poolPromise;
        const result = await pool.request()
            .input("id", id)
            .input("name", name)
            .input("email", email)
            .input("balance", balance)
            .query("UPDATE Users SET name=@name, email=@email, balance=@balance WHERE id=@id");

        if (result.rowsAffected[0] === 0) {
            res.status(404).json({ message: "User not found" });
        } else {
            res.json({ message: "User updated" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE пользователя
router.delete("/users/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await poolPromise;
        const result = await pool.request()
            .input("id", id)
            .query("DELETE FROM Users WHERE id=@id");

        if (result.rowsAffected[0] === 0) {
            res.status(404).json({ message: "User not found" });
        } else {
            res.json({ message: "User deleted" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
