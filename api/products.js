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
  const { method } = req;
  const products = readDB();

  if (method === "GET") {
    return res.status(200).json(products);
  }

  if (method === "POST") {
    const newProduct = { id: Date.now(), ...req.body };
    products.push(newProduct);
    writeDB(products);
    return res.status(201).json(newProduct);
  }

  if (method === "PUT") {
    const { id, ...rest } = req.body;
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return res.status(404).json({ error: "Not found" });

    products[index] = { id, ...rest };
    writeDB(products);
    return res.status(200).json(products[index]);
  }

  if (method === "DELETE") {
    const { id } = req.body;
    const filtered = products.filter((p) => p.id !== id);
    writeDB(filtered);
    return res.status(200).json({ message: "Deleted" });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
