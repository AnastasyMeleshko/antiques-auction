# Antiques Auction API

This is a **Node.js + Express** project for managing an online auction of antiques.  
The API supports three main services: **BidService**, **AntiqueService**, and **DisputeService**, each with full CRUD operations. The database used is **SQL Server**, which can be run locally via Docker or hosted in Azure.

---

## Table of Contents

- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Database Setup](#database-setup)
- [Services and CRUD Endpoints](#services-and-crud-endpoints)
  - [BidService](#bidservice)
  - [AntiqueService](#antiqueservice)
  - [DisputeService](#disputeservice)
- [Healthcheck](#healthcheck)
- [Notes](#notes)

---

## Project Structure

```

/antiques-auction
│
├─ /src
│   ├─ /services
│   │   ├─ bidService.js
│   │   ├─ antiqueService.js
│   │   └─ disputeService.js
│   ├─ db.js
│   └─ server.js
│
├─ dbInit.js
├─ tables.js
├─ package.json
└─ .gitignore

````

- **db.js** — database connection  
- **server.js** — main Express server, mounts all services  
- **/services/** — contains three services with their CRUD endpoints  
- **dbInit.js** — creates the database  
- **tables.js** — creates tables and inserts mock data  

---

## Setup Instructions

1. Clone the repository:

```bash
git clone https://github.com/AnastasyMeleshko/antiques-auction.git
cd antiques-auction
````

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root:

```
USERDB=sa
PASSWORD=YourPassword123!
SERVER=localhost
DATABASE=AntiquesAuctionDB
PORT=1433
```

4. Run SQL Server via Docker (local testing):

```bash
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=YourPassword123!" -p 1433:1433 --name sqlserver -d mcr.microsoft.com/mssql/server:2022-latest
```

5. Initialize database and tables:

```bash
node dbInit.js
node tables.js
```

6. Start the server:

```bash
node src/server.js
```

Server will run at: `http://localhost:3000`

---

## Services and CRUD Endpoints

### **BidService** (Users and Bids)

#### Users

* **GET /bid/users** — get all users
* **POST /bid/users** — create user

```json
{
  "name": "Alice",
  "email": "alice@example.com",
  "balance": 1000
}
```

* **PUT /bid/users/:id** — update user

```json
{
  "name": "Alice Updated",
  "email": "alice.new@example.com",
  "balance": 1200
}
```

* **DELETE /bid/users/:id** — delete user

#### Bids

* **GET /bid/bids** — get all bids
* **POST /bid/bids** — create bid

```json
{
  "auction_id": 1,
  "user_id": 1,
  "amount": 500
}
```

* **PUT /bid/bids/:id** — update bid

```json
{
  "amount": 600
}
```

* **DELETE /bid/bids/:id** — delete bid

---

### **AntiqueService**

* **GET /antique/antiques** — get all antiques
* **POST /antique/antiques** — create antique

```json
{
  "title": "Ancient Vase",
  "category": "Ceramics",
  "description": "Ming Dynasty",
  "starting_price": 100
}
```

* **PUT /antique/antiques/:id** — update antique

```json
{
  "title": "Ancient Vase Updated",
  "starting_price": 150
}
```

* **DELETE /antique/antiques/:id** — delete antique (blocked if part of active auction)

---

### **DisputeService**

* **GET /dispute/disputes** — get all disputes
* **POST /dispute/disputes** — create dispute

```json
{
  "auction_id": 1,
  "user_id": 1,
  "reason": "Suspicious bid",
  "evidence_url": "http://example.com/evidence",
  "status": "open"
}
```

* **PUT /dispute/disputes/:id** — update dispute status

```json
{
  "status": "resolved"
}
```

* **DELETE /dispute/disputes/:id** — delete dispute

---

## Healthcheck

* **GET /health** — checks API health (returns `API is healthy`)
* **GET /** — root route, returns `Antiques Auction API running`

---

## Notes

* Make sure your **database column names match your queries** (`id`, `user_id`, `auction_id`, etc.)
* Use **Postman** or **curl** to test all endpoints.
* For production, set up **authentication**, logging, and message broker for disputes.

