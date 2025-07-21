import fs from "fs";
import path from "path";

const dbPath = path.resolve("data/db.json");

function readDB() {
  const data = fs.readFileSync(dbPath, "utf-8");
  return JSON.parse(data);
}

function writeDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf-8");
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const db = readDB();
  const products = db.products;

  if (req.method === "GET") {
    return res.status(200).json(products);
  }

  if (req.method === "POST") {
    const newProduct = { id: Date.now(), ...req.body };
    db.products.push(newProduct);
    writeDB(db);
    return res.status(201).json(newProduct);
  }

  if (req.method === "PUT") {
    const { id, ...rest } = req.body;
    const index = db.products.findIndex((p) => p.id === id);
    if (index === -1) return res.status(404).json({ error: "Not found" });

    db.products[index] = { id, ...rest };
    writeDB(db);
    return res.status(200).json(db.products[index]);
  }

  if (req.method === "DELETE") {
    const { id } = req.body;
    db.products = db.products.filter((p) => p.id !== id);
    writeDB(db);
    return res.status(200).json({ message: "Deleted" });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
