# Antiques Auction API

This project is a **Node.js REST API** for managing an antiques auction platform. It provides endpoints to manage **users, antiques, auctions, bids, and disputes**, with data stored in **Azure SQL Database**.

---

## Table of Contents

1. [Technologies](#technologies)
2. [Project Structure](#project-structure)
3. [Database Schema](#database-schema)
4. [Setup & Installation](#setup--installation)
5. [Running the Server](#running-the-server)
6. [Seeding Mock Data](#seeding-mock-data)
7. [API Endpoints](#api-endpoints)
8. [Testing](#testing)

---

## Technologies

* **Node.js**
* **Express.js** — REST API framework
* **mssql** — Microsoft SQL Server client
* **Azure SQL Database** — cloud database
* **JavaScript (ES6 modules)**

---

## Project Structure

```
/src
├── services
│   ├── antiqueService.js   # CRUD operations for antiques
│   ├── bidService.js       # CRUD operations for users (bids)
│   └── disputeService.js   # CRUD operations for disputes
├── db.js                   # Azure SQL connection setup
├── seed.js                 # Script to populate database with mock data
└── server.js               # Express server setup
```

---

## Database Schema

The database `mialeshkaDB` contains the following tables and relationships:

| Table   | Description                                       | Primary Key | Foreign Keys                                                      |
| ------- | ------------------------------------------------- | ----------- | ----------------------------------------------------------------- |
| User    | Stores basic user information                     | userId      | Auction.userId, Bid.userId                                        |
| Antique | Represents antiques available for auction         | antiqueId   | Auction.antiqueId                                                 |
| Auction | Represents an auction for a specific antique      | auctionId   | antiqueId → Antique, userId → User, leadingBidId → Bid (optional) |
| Bid     | Stores bids placed by users on auctions           | bidId       | auctionId → Auction, userId → User                                |
| Dispute | Represents disputes raised for a specific auction | disputeId   | auctionId → Auction                                               |

**Relationships:**

* One user can create multiple auctions and place multiple bids.
* One antique can have multiple auctions.
* One auction can have multiple bids and disputes.
* Each bid belongs to one auction and one user.
* Each dispute is linked to one auction.

---

## Setup & Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd antiques-auction/src
```

2. Install dependencies:

```bash
npm install
```

3. Configure Azure SQL connection in `db.js`:

```js
export const config = {
    user: "YOUR_SQL_LOGIN",
    password: "YOUR_PASSWORD",
    server: "YOUR_SERVER.database.windows.net",
    database: "YOUR_DATABASE",
    options: {
        encrypt: true,
        trustServerCertificate: false
    }
};
```

> **Note:** It's recommended to use environment variables (`.env`) to store credentials.

4. Make sure your **client IP is allowed** in Azure SQL firewall:

* Go to Azure Portal → SQL server → Networking → Add your client IP.
* Enable "Allow Azure services and resources to access this server".

---

## Running the Server

Start the Express server:

```bash
node server.js
```

Server runs on `http://localhost:3000`.

**Healthcheck:**

```
GET /health
Response: "API is healthy"
```

---

## Seeding Mock Data

`seed.js` populates the database with **sample users, antiques, auctions, bids, and disputes**.

### Run the seeding script:

```bash
node seed.js
```

✅ Expected output:

```
Connected to Azure SQL
Seeding database...
Database seeded successfully!
```

### Notes:

* Seed script ensures proper order of insertion respecting **foreign keys**.
* Automatically sets required **NOT NULL fields** such as:

    * `Auction.startTime`, `Auction.endTime`, `Auction.status`
    * `Bid.amount`, `Bid.status`, `Bid.timestamp`
* Adds sample data for testing your API endpoints.

---

## API Endpoints

### Antiques

* `GET /antique/antiques` — list all antiques
* `POST /antique/antiques` — create an antique
* `PUT /antique/antiques/:id` — update antique
* `DELETE /antique/antiques/:id` — delete antique

### Users

* `GET /bid/users` — list all users
* `POST /bid/users` — create user
* `PUT /bid/users/:id` — update user
* `DELETE /bid/users/:id` — delete user

### Disputes

* `GET /dispute/disputes` — list all disputes
* `POST /dispute/disputes` — create dispute

---

## Testing

1. Use **Postman** or **curl** to test endpoints.
2. Verify seeded data via **Azure Query Editor** or API GET endpoints:

```bash
GET http://localhost:3000/antique/antiques
GET http://localhost:3000/bid/users
GET http://localhost:3000/dispute/disputes
```



