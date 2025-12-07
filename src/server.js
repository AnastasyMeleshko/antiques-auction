import express from "express";
import bidService from "./services/bidService.js";
import antiqueService from "./services/antiqueService.js";
import disputeService from "./services/disputeService.js";

const app = express();
const PORT = 3000;

// JSON parser
app.use(express.json());

// подключаем сервисы
app.use("/bid", bidService);
app.use("/antique", antiqueService);
app.use("/dispute", disputeService);

// healthcheck
app.get("/health", (req, res) => res.send("API is healthy"));

// корень
app.get("/", (req, res) => res.send("Antiques Auction API running"));

// запуск сервера
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
